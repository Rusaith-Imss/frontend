import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('http://127.0.0.1:8000/api/users');
            setUsers(response.data);
        } catch (error) {
            setError('Failed to fetch users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            setError('Failed to delete user. Please try again.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">User Management</h1>

            {loading && <p className="text-center text-gray-600">Loading users...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4">{user.role}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && !error && users.length === 0 && (
                <p className="text-center text-gray-600">No users found.</p>
            )}
        </div>
    );
};

export default UserList;