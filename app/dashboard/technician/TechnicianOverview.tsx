export default function TechnicianOverview({user} : any) {
  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">
        Technician Panel
      </h2>

      <p className="text-sm text-gray-500">
        You have assigned service requests waiting.
      </p>

      <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded">
        View Assigned Requests
      </button>
    </section>
  );
}
