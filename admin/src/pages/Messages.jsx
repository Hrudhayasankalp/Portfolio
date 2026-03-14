import { useState, useEffect } from "react";
import api from "../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      fetchMessages();
    } catch (err) {
      alert("Error deleting message");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          <p className="text-gray-500 text-sm mt-1">Inquiries from your portfolio contact form.</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-bold">
          {messages.length} Total
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-gray-50">
            <div className="text-4xl mb-3">📭</div>
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg._id} className="p-6 hover:bg-gray-50 transition relative group">
                <button 
                  onClick={() => deleteMessage(msg._id)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                  title="Delete message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex items-center justify-between mb-4 pr-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{msg.name}</h4>
                      <a href={`mailto:${msg.email}`} className="text-sm text-blue-500 hover:underline">{msg.email}</a>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                </div>
                <div className="pl-13 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
