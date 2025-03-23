import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Assuming you have a Header component

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo content for signed-up and signed-in personnel
    const demoUsers: User[] = [
      {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        username: "jane_smith",
        email: "jane@example.com",
        role: "user",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        username: "alice_jones",
        email: "alice@example.com",
        role: "user",
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        username: "bob_brown",
        email: "bob@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        username: "charlie_black",
        email: "charlie@example.com",
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setUsers(demoUsers);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="w-full bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6">Users</h2>
          <div className="w-full max-w-4xl">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-left">Username</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                  <th className="py-2 text-left">Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2">{user.username}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
