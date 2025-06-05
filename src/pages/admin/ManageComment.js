import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getComments, deleteComment } from '../../api/CommentAPI.js';
import LoadingEffect from '../../components/LoadingEffect.js';
import { getAllActiveMovies } from '../../api/QuickTicketAPI.js';
function ManageComment() {
  const [comments, setComments] = useState([]);
const [loading, setLoading] = useState(true);
    // Trong component của bạn
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    commentsPerPage: 10
  });
  const [filters, setFilters] = useState({
    content: '',
    movieId: '',
    startDate: '',
    endDate: '',
    isRootOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
    

    // Lấy danh sách phim khi component mount
    useEffect(() => {
    const fetchMovies = async () => {
        try {
        const response = await getAllActiveMovies();
        setMovies(response.data);
        } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
        }
    };
    fetchMovies();
    }, []);
  useEffect(() => {
    fetchComments();
  }, [pagination.currentPage, filters, selectedMovieId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getComments({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.commentsPerPage
      });
      
      setComments(response.data.comments);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        await deleteComment(commentId);
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto">
      
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg mb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                name="content"
                value={filters.content}
                onChange={handleFilterChange}
                placeholder="Tìm kiếm nội dung bình luận..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition duration-200"
            >
              <FiFilter className="mr-2" />
              Lọc
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-2 flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1 truncate">Phim</label>
                    <select 
                    value={filters.movieId}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        movieId: e.target.value
                    }))}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    >
                    <option value="">Chọn phim</option>
                    {movies.map((movie) => (
                        <option key={movie._id} value={movie._id}>
                        {movie.title}
                        </option>
                    ))}
                    </select>
                </div>
                
                <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1 truncate">Từ ngày</label>
                    <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1 truncate">Đến ngày</label>
                    <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>
          )}
        </div>
        
        {/* Comments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
                <LoadingEffect/>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-black ">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Phim
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nội dung
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Ngày tạo
                      </th>
                   
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <tr key={comment.commentId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {comment.userAvatar ? (
                                  <img className="h-10 w-10 rounded-full" src={comment.userAvatar} alt={comment.username} />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                    {comment.username.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{comment.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                      {comment?.movieTitle?.length > 15 
                                        ? `${comment?.movieTitle?.substring(0, 15)}...` 
                                        : comment?.movieTitle}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{comment.content}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(comment.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(comment.commentId)}
                              className="text-red-600 hover:text-red-900 transition duration-150"
                              title="Xóa bình luận"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          Không tìm thấy bình luận nào phù hợp
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{(pagination.currentPage - 1) * pagination.commentsPerPage + 1}</span> đến{' '}
                        <span className="font-medium">{Math.min(pagination.currentPage * pagination.commentsPerPage, pagination.totalComments)}</span> trong tổng số{' '}
                        <span className="font-medium">{pagination.totalComments}</span> bình luận
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          <span className="sr-only">Previous</span>
                          <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.currentPage === page ? 'z-10 bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          <span className="sr-only">Next</span>
                          <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageComment;