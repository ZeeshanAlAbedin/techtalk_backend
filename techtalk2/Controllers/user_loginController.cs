using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using techtalk2;
using System.Web.Http.Cors;

namespace techtalk2.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class user_loginController : ApiController
    {
        private techtalk2Entities2 db = new techtalk2Entities2();

        public IHttpActionResult LoginCheck(user_login user)
        {
            user_login foundUser = db.user_login.Where(a => a.user_username.Equals(user.user_username)).FirstOrDefault();
            if (foundUser == null)
                return NotFound();
            else if (foundUser != null && user.user_password.Equals(foundUser.user_password))
                return Ok("Correct");
            else
                return NotFound();
        }

        // GET: api/user_login
        public IQueryable<user_login> Getuser_login()
        {
            return db.user_login;
        }

        // GET: api/user_login/5
        [ResponseType(typeof(user_login))]
        public IHttpActionResult Getuser_login(int id)
        {
            user_login user_login = db.user_login.Find(id);
            if (user_login == null)
            {
                return NotFound();
            }

            return Ok(user_login);
        }

        // PUT: api/user_login/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putuser_login(int id, user_login user_login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user_login.ID)
            {
                return BadRequest();
            }

            db.Entry(user_login).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!user_loginExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/user_login
        [ResponseType(typeof(user_login))]
        public IHttpActionResult Postuser_login(user_login user_login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.user_login.Add(user_login);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user_login.ID }, user_login);
        }

        // DELETE: api/user_login/5
        [ResponseType(typeof(user_login))]
        public IHttpActionResult Deleteuser_login(int id)
        {
            user_login user_login = db.user_login.Find(id);
            if (user_login == null)
            {
                return NotFound();
            }

            db.user_login.Remove(user_login);
            db.SaveChanges();

            return Ok(user_login);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool user_loginExists(int id)
        {
            return db.user_login.Count(e => e.ID == id) > 0;
        }
    }
}