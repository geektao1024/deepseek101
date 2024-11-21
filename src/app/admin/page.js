'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminPage() {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ name: '', description: '', url: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalResource, setOriginalResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 每页显示10条记录
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      if (!data.isLoggedIn) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setError('Failed to authenticate. Please try again.');
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchResources();
  }, [checkAuth]);

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resources?source=github');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to fetch resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedResources = [...resources];
      updatedResources[index] = { ...updatedResources[index], [name]: value };
      setResources(updatedResources);
    } else {
      setNewResource({ ...newResource, [name]: value });
    }
  };

  const handleEdit = (index) => {
    setOriginalResource({...resources[index]});
    setEditingIndex(index);
  };

  const handleSave = async (index) => {
    let updatedResources = [...resources];
    if (index === -1) {
      updatedResources.push(newResource);
      setNewResource({ name: '', description: '', url: '' });
    }
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedResources),
      });
      if (!response.ok) {
        throw new Error('Failed to save resources');
      }
      await fetchResources(); // Fetch the latest data after saving
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving resources:', error);
      setError('Failed to save resources. Please try again.');
    }
  };

  // 计算当前页的资源
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return resources.slice(startIndex, endIndex);
  };

  // 计算总页数
  const totalPages = Math.ceil(resources.length / itemsPerPage);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4">
        <Link href="/admin/articles">
          <Button>Manage Articles</Button>
        </Link>
      </div>
      <h2 className="text-xl font-bold mb-4">Resource Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input 
                name="name" 
                value={newResource.name} 
                onChange={handleInputChange} 
                placeholder="New resource name" 
              />
            </TableCell>
            <TableCell>
              <Input 
                name="description" 
                value={newResource.description} 
                onChange={handleInputChange} 
                placeholder="New resource description" 
              />
            </TableCell>
            <TableCell>
              <Input 
                name="url" 
                value={newResource.url} 
                onChange={handleInputChange} 
                placeholder="New resource URL" 
              />
            </TableCell>
            <TableCell>
              <Button onClick={() => handleSave(-1)}>Add New</Button>
            </TableCell>
          </TableRow>
          {getCurrentPageItems().map((resource, index) => (
            <TableRow key={index}>
              <TableCell>
                {editingIndex === index ? (
                  <Input name="name" value={resource.name} onChange={(e) => handleInputChange(e, index)} />
                ) : (
                  resource.name
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input name="description" value={resource.description} onChange={(e) => handleInputChange(e, index)} />
                ) : (
                  resource.description
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input name="url" value={resource.url} onChange={(e) => handleInputChange(e, index)} />
                ) : (
                  resource.url
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <>
                    <Button onClick={() => handleSave(index)} className="mr-2">Save</Button>
                    <Button 
                      onClick={() => {
                        setEditingIndex(null);
                        const updatedResources = [...resources];
                        updatedResources[index] = originalResource;
                        setResources(updatedResources);
                        setOriginalResource(null);
                      }} 
                      variant="outline"
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEdit(index)} className="mr-2">Edit</Button>
                    <Button 
                      onClick={async () => {
                        if(confirm('Are you sure you want to delete this resource?')) {
                          const newResources = resources.filter((_, i) => i !== index);
                          try {
                            await fetch('/api/resources', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(newResources)
                            });
                            setResources(newResources);
                          } catch (error) {
                            console.error('Error deleting resource:', error);
                            setError('Failed to delete resource');
                          }
                        }
                      }}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 分页控制 */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}