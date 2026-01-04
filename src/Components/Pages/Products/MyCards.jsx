import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { FiShoppingCart, FiTrash2, FiPackage, FiCalendar } from "react-icons/fi";

const MyCards = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchCards = async () => {
      try {
        const res = await axiosSecure.get("/cards");
        setCards(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCards();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const res = await axiosSecure.delete(`/cards/${id}`);
      if (res.data.deletedCount > 0) {
        setCards(cards.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full">
            <FiShoppingCart className="text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">All Cart Items</h1>
        </div>

        {cards.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-lg">No items found in your cart.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 text-left text-gray-700 font-semibold">Product</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Quantity</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Price</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Date Added</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                          <FiPackage className="text-gray-400 text-xl" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-500">ID: {item.productId?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{item.quantity}</td>
                    <td className="p-4 font-semibold text-gray-800">{item.totalAmount}</td>
                    <td className="p-4 text-gray-600 flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {new Date(item.addedAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center gap-2"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCards;
