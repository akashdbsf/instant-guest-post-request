/**
 * Pending Submissions Component
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const PendingSubmissions = ({ posts, count, onRefresh, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">{__('Pending Submissions', 'instant-guest-post-request')} ({count})</h2>
      </div>
      <div className="p-4">
        {posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {__('Title', 'instant-guest-post-request')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {__('Author', 'instant-guest-post-request')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {__('Date', 'instant-guest-post-request')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {__('Actions', 'instant-guest-post-request')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map(post => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <a href={post.edit_url} className="hover:underline">{post.title}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.author_name}</div>
                      <div className="text-sm text-gray-500">{post.author_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button 
                          isSecondary
                          isSmall
                          href={post.preview_url}
                          target="_blank"
                        >
                          {__('Preview', 'instant-guest-post-request')}
                        </Button>
                        <Button 
                          isPrimary
                          isSmall
                          onClick={() => onApprove(post.id)}
                        >
                          {__('Approve', 'instant-guest-post-request')}
                        </Button>
                        <Button 
                          isDanger
                          isSmall
                          onClick={() => onReject(post.id)}
                        >
                          {__('Reject', 'instant-guest-post-request')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{__('No pending submissions', 'instant-guest-post-request')}</h3>
            <p className="mt-1 text-sm text-gray-500">{__('There are no pending guest post submissions at this time.', 'instant-guest-post-request')}</p>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-4 flex justify-end">
        <Button 
          isSecondary
          onClick={onRefresh}
        >
          {__('Refresh List', 'instant-guest-post-request')}
        </Button>
      </div>
    </div>
  );
};

export default PendingSubmissions;