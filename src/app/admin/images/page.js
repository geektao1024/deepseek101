'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Plus,           // 添加图片按钮图标
  Edit2,          // 编辑按钮图标
  Save,           // 保存按钮图标
  X,              // 取消按钮图标
  Trash2,         // 删除按钮图标
  ChevronLeft,    // 上一页按钮图标
  ChevronRight,   // 下一页按钮图标
  Upload,         // 上传图标
  RefreshCw       // 同步按钮图标
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert } from "@/components/ui/alert"
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export default function ImagesPage() {
  // 状态管理
  const [faviconImages, setFaviconImages] = useState([]);
  const [pictureImages, setPictureImages] = useState([]);
  const [editingIndex, setEditingIndex] = useState({ type: null, index: null });
  const [originalName, setOriginalName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState({ favicon: 1, pictures: 1 });
  const itemsPerPage = 15;
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    progress: 0,
    success: null,
    error: null,
    files: []
  });

  // 认证检查
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
      setError('Failed to authenticate');
      setIsLoading(false);
    }
  }, [router]);

  // 获取图片列表，添加强制同步参数
  const fetchImages = useCallback(async (forceSync = false) => {
    try {
      console.log('开始获取图片列表...');
      // 添加 sync 参数强制同步
      const response = await fetch(`/api/images${forceSync ? '?sync=true' : ''}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      console.log('获取到的图片数据:', data);
      setFaviconImages(data.favicons);
      setPictureImages(data.pictures);
      setError(null);  // 清除错误状态
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    }
  }, []);

  // 强制同步函数
  const handleSync = useCallback(() => {
    fetchImages(true);
  }, [fetchImages]);

  // 初始化和定期同步
  useEffect(() => {
    checkAuth();
    // 首次加载时强制同步
    fetchImages(true);

    // 设置定期同步
    const syncInterval = setInterval(() => {
      fetchImages(true);
    }, 30000); // 每30秒同步一次

    return () => clearInterval(syncInterval);
  }, [checkAuth, fetchImages]);

  // 处理文件名编辑
  const handleEdit = (type, index, currentName) => {
    setEditingIndex({ type, index });
    setOriginalName(currentName);
  };

  // 处理文件名保存
  const handleSave = async (type, index, newName) => {
    try {
      // 先保存当前状态，以便发生错误时可以回滚
      const currentImages = type === 'favicon' ? [...faviconImages] : [...pictureImages];
      const oldName = originalName;

      // 立即更新本地状态
      if (type === 'favicon') {
        const updatedImages = [...faviconImages];
        updatedImages[index] = { ...updatedImages[index], name: newName };
        setFaviconImages(updatedImages);
      } else {
        const updatedImages = [...pictureImages];
        updatedImages[index] = { ...updatedImages[index], name: newName };
        setPictureImages(updatedImages);
      }

      // 重置编辑状态
      setEditingIndex({ type: null, index: null });
      setOriginalName(null);

      // 异步处理 GitHub 更新
      const response = await fetch('/api/images/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          oldName,
          newName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rename image on GitHub');
      }

    } catch (error) {
      // 如果 GitHub 更新失败，回滚本地状态
      console.error('Error renaming image:', error);
      if (type === 'favicon') {
        const originalImageIndex = faviconImages.findIndex(img => img.name === originalName);
        if (originalImageIndex !== -1) {
          const updatedImages = [...faviconImages];
          updatedImages[originalImageIndex] = { ...updatedImages[originalImageIndex], name: originalName };
          setFaviconImages(updatedImages);
        }
      } else {
        const originalImageIndex = pictureImages.findIndex(img => img.name === originalName);
        if (originalImageIndex !== -1) {
          const updatedImages = [...pictureImages];
          updatedImages[originalImageIndex] = { ...updatedImages[originalImageIndex], name: originalName };
          setPictureImages(updatedImages);
        }
      }
      setError('Failed to rename image on GitHub. Changes reverted.');
    }
  };

  // 处理文件删除
  const handleDelete = async (type, filename) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/images/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, filename })
      });

      if (!response.ok) throw new Error('Failed to delete image');
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  // 处理文件上传
  const handleFileSelect = async (type, event) => {
    const files = event.target.files;
    if (!files.length) return;

    setUploadStatus({
      isUploading: true,
      progress: 0,
      success: null,
      error: null,
      files: Array.from(files).map(file => ({
        name: file.name,
        status: 'pending'
      }))
    });

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('type', type);

    try {
      setUploadStatus(prev => ({ ...prev, progress: 20 }));
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });

      setUploadStatus(prev => ({ ...prev, progress: 60 }));

      if (!response.ok) throw new Error('Failed to upload images');
      const result = await response.json();
      
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        success: `Successfully uploaded ${files.length} files`,
        files: prev.files.map(file => ({ ...file, status: 'success' }))
      }));

      // 刷新图片列表
      await fetchImages(true);
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error: 'Failed to upload images',
        files: prev.files.map(file => ({ ...file, status: 'error' }))
      }));
    }
  };

  // 获取分页数据
  const getCurrentPageItems = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <AuthWrapper>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Images Management</h1>
          <Button 
            onClick={handleSync}
            className="mb-4"
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Sync Images
          </Button>
        </div>

        {/* 使用 grid 进行左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favicon 图片管理 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Favicon Images</h2>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect('favicon', e)}
                  className="hidden"
                  id="favicon-upload"
                />
                <Button
                  asChild
                  icon={<Upload className="h-4 w-4" />}
                >
                  <label htmlFor="favicon-upload" className="cursor-pointer">
                    Upload Favicons
                  </label>
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Title</TableHead>
                  <TableHead className="w-[30%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPageItems(faviconImages, currentPage.favicon).map((image, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingIndex.type === 'favicon' && editingIndex.index === index ? (
                        <Input
                          value={image.name}
                          onChange={(e) => {
                            const newImages = [...faviconImages];
                            newImages[index] = { ...image, name: e.target.value };
                            setFaviconImages(newImages);
                          }}
                        />
                      ) : (
                        <div className="truncate" title={image.name}>{image.name}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {editingIndex.type === 'favicon' && editingIndex.index === index ? (
                          <>
                            <Button
                              onClick={() => handleSave('favicon', index, image.name)}
                              icon={<Save className="h-4 w-4" />}
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingIndex({ type: null, index: null });
                                const newImages = [...faviconImages];
                                newImages[index] = { ...image, name: originalName };
                                setFaviconImages(newImages);
                              }}
                              icon={<X className="h-4 w-4" />}
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleEdit('favicon', index, image.name)}
                              icon={<Edit2 className="h-4 w-4" />}
                            />
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete('favicon', image.name)}
                              icon={<Trash2 className="h-4 w-4" />}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Favicon 分页控制 */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => ({ ...prev, favicon: Math.max(prev.favicon - 1, 1) }))}
                disabled={currentPage.favicon === 1}
                variant="outline"
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {currentPage.favicon} of {Math.ceil(faviconImages.length / itemsPerPage)}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => ({
                  ...prev,
                  favicon: Math.min(prev.favicon + 1, Math.ceil(faviconImages.length / itemsPerPage))
                }))}
                disabled={currentPage.favicon === Math.ceil(faviconImages.length / itemsPerPage)}
                variant="outline"
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Pictures 图片管理 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Article Pictures</h2>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect('pictures', e)}
                  className="hidden"
                  id="pictures-upload"
                />
                <Button
                  asChild
                  icon={<Upload className="h-4 w-4" />}
                >
                  <label htmlFor="pictures-upload" className="cursor-pointer">
                    Upload Pictures
                  </label>
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Title</TableHead>
                  <TableHead className="w-[30%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentPageItems(pictureImages, currentPage.pictures).map((image, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingIndex.type === 'pictures' && editingIndex.index === index ? (
                        <Input
                          value={image.name}
                          onChange={(e) => {
                            const newImages = [...pictureImages];
                            newImages[index] = { ...image, name: e.target.value };
                            setPictureImages(newImages);
                          }}
                        />
                      ) : (
                        <div className="truncate" title={image.name}>{image.name}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {editingIndex.type === 'pictures' && editingIndex.index === index ? (
                          <>
                            <Button
                              onClick={() => handleSave('pictures', index, image.name)}
                              icon={<Save className="h-4 w-4" />}
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingIndex({ type: null, index: null });
                                const newImages = [...pictureImages];
                                newImages[index] = { ...image, name: originalName };
                                setPictureImages(newImages);
                              }}
                              icon={<X className="h-4 w-4" />}
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleEdit('pictures', index, image.name)}
                              icon={<Edit2 className="h-4 w-4" />}
                            />
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete('pictures', image.name)}
                              icon={<Trash2 className="h-4 w-4" />}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pictures 分页控制 */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => ({ ...prev, pictures: Math.max(prev.pictures - 1, 1) }))}
                disabled={currentPage.pictures === 1}
                variant="outline"
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {currentPage.pictures} of {Math.ceil(pictureImages.length / itemsPerPage)}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => ({
                  ...prev,
                  pictures: Math.min(prev.pictures + 1, Math.ceil(pictureImages.length / itemsPerPage))
                }))}
                disabled={currentPage.pictures === Math.ceil(pictureImages.length / itemsPerPage)}
                variant="outline"
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* 上传状态对话框 */}
        <Dialog open={uploadStatus.isUploading} onOpenChange={() => {
          if (!uploadStatus.isUploading) {
            setUploadStatus({
              isUploading: false,
              progress: 0,
              success: null,
              error: null,
              files: []
            });
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uploading Images</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Progress value={uploadStatus.progress} className="mb-4" />
              {uploadStatus.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="truncate">{file.name}</span>
                  <span className={`text-sm ${
                    file.status === 'success' ? 'text-green-500' :
                    file.status === 'error' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {file.status === 'success' ? 'Uploaded' :
                     file.status === 'error' ? 'Failed' :
                     'Pending'}
                  </span>
                </div>
              ))}
            </div>
            {uploadStatus.success && (
              <Alert className="bg-green-50 text-green-700 mb-4">
                {uploadStatus.success}
              </Alert>
            )}
            {uploadStatus.error && (
              <Alert className="bg-red-50 text-red-700 mb-4">
                {uploadStatus.error}
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthWrapper>
  );
} 