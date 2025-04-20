import React from 'react';

const mockEvents = [
  {
    id: 1,
    title: 'Hackathon 2023',
    date: '2023-02-12',
    feedbackGiven: true,
  },
  {
    id: 2,
    title: 'Web3 Meetup',
    date: '2023-03-18',
    feedbackGiven: false,
  },
];

const UserEvents = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Past Events</h3>
      {mockEvents.length === 0 ? (
        <p className="text-gray-500">No events participated yet.</p>
      ) : (
        <ul className="space-y-3">
          {mockEvents.map((event) => (
            <li
              key={event.id}
              className="border-b pb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">{new Date(event.date).toDateString()}</p>
              </div>
              <span
                className={`text-sm font-medium ${
                  event.feedbackGiven ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {event.feedbackGiven ? 'Feedback Given' : 'No Feedback'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserEvents;