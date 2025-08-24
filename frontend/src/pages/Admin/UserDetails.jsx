import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/users/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        if (res.ok) {
          const fetchedUser = data.user || data;
          setUser(fetchedUser);

          if (fetchedUser.role === 'store_owner') {
            const fetchedRatings = data.ratings || fetchedUser.ratings || [];
            setRatings(fetchedRatings);
          }
        } else {
          console.error(data.message || 'Failed to fetch user');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-black text-xl font-semibold">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="text-center text-black text-xl font-semibold mt-20">
        User not found.
      </div>
    );

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-blue-50 rounded-3xl shadow-xl p-8 border border-blue-200">
       
        <h1 className="text-3xl font-extrabold text-black mb-6 text-center">
          User Details
        </h1>

       
        <div className="grid grid-cols-1 gap-4 text-black text-lg bg-blue-100 p-4 rounded-3xl">
          <p>
            <span className="font-semibold text-black">Name:</span>{' '}
            {user.name}
          </p>
          <p>
            <span className="font-semibold text-black">Email:</span>{' '}
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-black">Address:</span>{' '}
            {user.address}
          </p>
          <p>
            <span className="font-semibold text-black">Role:</span>{' '}
            {user.role}
          </p>
        </div>

        
        {user.role === 'store_owner' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              Ratings
            </h2>
            {ratings.length > 0 ? (
              <ul className="space-y-3">
                {ratings.map((r) => (
                  <li
                    key={r.id || `${r.store_id}-${r.user_id}`}
                    className="bg-blue-100 rounded-lg p-4 shadow-sm text-black hover:bg-blue-200 transition"
                  >
                    <p>
                      <span className="font-semibold text-black">
                        Store:
                      </span>{' '}
                      {r.store.name}
                    </p>
                    <p>
                      <span className="font-semibold text-black">
                        Rating:
                      </span>{' '}
                      {r.rating}/5
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No ratings yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
