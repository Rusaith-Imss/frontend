import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminAccessPanel = ({ user }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active',
    });

    const [editUser, setEditUser] = useState({
        id: null,
        role: '',
        status: '',
    });

    // Check if the user object exists
    if (!user) {
        return <div>Loading user data...</div>;
    }

    // Check if the user has the required role
    if (user.role !== 'admin' && user.role !== 'superadmin') {
        navigate('/unauthorized'); // Redirect to unauthorized page
    }

    // Fetch users from the backend
    const fetchUsers = async (page = 1) => {
        try {
            const response = await axios.get(`/api/users?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data.users.data);
            setTotalPages(response.data.users.last_page);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Delete a user
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    // Create a new user
    const handleCreateUser = async () => {
        try {
            const response = await axios.post('/api/users', newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers([...users, response.data.user]);
            setNewUser({ name: '', email: '', password: '', role: 'user', status: 'active' });
        } catch (err) {
            setError('Failed to create user');
        }
    };

    // Update user role
    const handleUpdateRole = async () => {
        try {
            await axios.put(`/api/users/${editUser.id}/role`, { role: editUser.role }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.map((user) =>
                user.id === editUser.id ? { ...user, role: editUser.role } : user
            ));
            setEditUser({ id: null, role: '', status: '' });
        } catch (err) {
            setError('Failed to update user role');
        }
    };

    // Update user status
    const handleUpdateStatus = async () => {
        try {
            await axios.put(`/api/users/${editUser.id}/status`, { status: editUser.status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.map((user) =>
                user.id === editUser.id ? { ...user, status: editUser.status } : user
            ));
            setEditUser({ id: null, role: '', status: '' });
        } catch (err) {
            setError('Failed to update user status');
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Admin Access Panel</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Create User Form */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Create New User</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <select
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                    <button
                        onClick={handleCreateUser}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Create User
                    </button>
                </div>
            </div>

            {/* User Table */}
            <table className="w-full border-collapse mb-4">
                <thead>
                    <tr>
                        <th className="bg-gray-200 p-2 border">ID</th>
                        <th className="bg-gray-200 p-2 border">Name</th>
                        <th className="bg-gray-200 p-2 border">Email</th>
                        <th className="bg-gray-200 p-2 border">Role</th>
                        <th className="bg-gray-200 p-2 border">Status</th>
                        <th className="bg-gray-200 p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="p-2 border">{user.id}</td>
                            <td className="p-2 border">{user.name}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">
                                {editUser.id === user.id ? (
                                    <select
                                        value={editUser.role}
                                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                        className="p-1 border border-gray-300 rounded"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Superadmin</option>
                                        <option value="manager">Manager</option>
                                        <option value="editor">Editor</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td className="p-2 border">
                                {editUser.id === user.id ? (
                                    <select
                                        value={editUser.status}
                                        onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                                        className="p-1 border border-gray-300 rounded"
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                ) : (
                                    user.status
                                )}
                            </td>
                            <td className="p-2 border">
                                {editUser.id === user.id ? (
                                    <>
                                        <button
                                            onClick={handleUpdateRole}
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            Save Role
                                        </button>
                                        <button
                                            onClick={handleUpdateStatus}
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                        >
                                            Save Status
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setEditUser({ id: user.id, role: user.role, status: user.status })}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminAccessPanel;