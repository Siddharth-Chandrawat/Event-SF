import EventForm from "../components/EventForm";
import Navbar from "../components/Navbar";

const EventCreator = () => {
  const handleCreate = async (eventData) => {
    await createEvent(eventData); // context handles update
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <EventForm onSubmit={handleCreate} />
      </div>
    </>
  )
}

export default EventCreator; 
