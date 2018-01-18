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
    public class EventTablesController : ApiController
    {

        private techtalk2Entities db = new techtalk2Entities();

        // GET: api/EventTables
        public IQueryable<EventTable> GetEventTables()
        {
            var upcomingEvents = from s in db.EventTables where s.isPassed == false orderby s.Edate select s;
            return upcomingEvents;
        }

        [HttpGet]
        public IQueryable<EventTable> GetPastEvents()
        {
            var pastEvents = from s in db.EventTables where s.isPassed == true orderby s.Edate descending select s;
            return pastEvents;
        }

        [HttpGet]
        public IEnumerable<EventTable> GetAllEvents()
        {
            return db.EventTables;
        }

        // GET: api/EventTables/5
        [ResponseType(typeof(EventTable))]
        public IHttpActionResult GetEventTable(int id)
        {
            EventTable eventTable = db.EventTables.Find(id);
            if (eventTable == null)
            {
                return NotFound();
            }

            return Ok(eventTable);
        }

        

        // POST: api/EventTables
        [ResponseType(typeof(EventTable))]
        public IHttpActionResult PostEventTable(EventTable eventTable)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventTables.Add(eventTable);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (EventTableExists(eventTable.ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = eventTable.ID }, eventTable);
        }

        //Update
        [HttpPost]
        public IHttpActionResult UpdateEventTable(int id, EventTable eventTable)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updateEvents = from s in db.EventTables where s.ID == id select s;
            foreach(EventTable e in updateEvents)
            {
                e.Ename = eventTable.Ename;
                e.Pname = eventTable.Pname;
                e.Edate = eventTable.Edate;
            }
            db.SaveChanges();
            return Ok();
        }






        // DELETE: api/EventTables/5
        [ResponseType(typeof(EventTable))]
        public IHttpActionResult DeleteEventTable(int id)
        {
            EventTable eventTable = db.EventTables.Find(id);
            if (eventTable == null)
            {
                return NotFound();
            }

            db.EventTables.Remove(eventTable);
            db.SaveChanges();

            return Ok(eventTable);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventTableExists(int id)
        {
            return db.EventTables.Count(e => e.ID == id) > 0;
        }
    }
}