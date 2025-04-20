import EventForm from "../components/EventForm";

const EventCreator = () => {

  const handleCreate = async (eventData) => {
    await createEvent(eventData); // context handles update
  };

  return (
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Create a New Event</h2>
        <EventForm onSubmit={handleCreate} />
      </div>
  )
}

export default EventCreator; 
