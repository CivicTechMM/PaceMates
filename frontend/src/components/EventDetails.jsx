import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent } from '../adapters/event-adapter';
import EventSignUp from './EventSignUp';
import ParticipantList from './ParticipantList';
import EventDelete from './EventDelete';
import EventUpdate from './EventUpdate';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleUpdateEventClick = () => {
    setShowForm(!showForm);
  }
  // const [isAuthenticated, setIsAuthenticated] = useState(false); // State for user authentication status
  // const navigate = useNavigate(); // for redirection

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const [eventData] = await getEvent(parseInt(id));
        if (eventData) {
          setEvent(eventData)
          
        } else {
          setError('Event not found');
        }
      } catch (error) {
        setError('Error fetching event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id])
  if (loading) {
    return <p>Loading event details...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }
  return (
    // figure out what makes more sense to have in the card vs here
    // think max needs to be in card
    <div className="event-details">
      {/* Map */}
      <p>Start Address: {event.starting_point}</p>
      <p>End Address: {event.ending_point}</p>
      <p>Distance: {event.distance}</p>
      <p>Location: {event.location}</p>

      <h2>{event.title}</h2>
      <p>Date: {event.date}</p>
      <p>Time: {event.time}</p>
      {/* dropdown somehow? */}
      <p>Attending: <ParticipantList/>
      </p>
      <p>Description: {event.description}</p>
      {/* move to card? nice to have like 10/15 */}
      <p>Max Participants: {event.max_participants}</p>

      {/* button to "attend" */}
      <EventSignUp />
      {/* if user who created, button to edit and delete */}
      <EventDelete />

      {
      !!isCurrentUserProfile
      && <EventUpdate currentEvent={currentEvent} setCurrentEvent={setCurrentEvent} />
    }

    </div>
  );
};

export default EventDetails;
