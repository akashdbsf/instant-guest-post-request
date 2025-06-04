/**
 * Pending Submissions Component
 */
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Button 
} from '@wordpress/components';

const PendingSubmissions = ({ posts, count, onRefresh, onApprove, onReject }) => {
  return (
    <Card>
      <CardHeader>
        <h2>Pending Submissions ({count})</h2>
      </CardHeader>
      <CardBody>
        {posts.length > 0 ? (
          <table className="wp-list-table widefat fixed striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <strong><a href={post.edit_url}>{post.title}</a></strong>
                  </td>
                  <td>
                    {post.author_name}<br />
                    <small>{post.author_email}</small>
                  </td>
                  <td>{post.date}</td>
                  <td>
                    <div className="igpr-action-buttons">
                      <Button 
                        isSecondary
                        isSmall
                        href={post.preview_url}
                        target="_blank"
                      >
                        Preview
                      </Button>
                      <Button 
                        isPrimary
                        isSmall
                        onClick={() => onApprove(post.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        isDanger
                        isSmall
                        onClick={() => onReject(post.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending guest post submissions.</p>
        )}
      </CardBody>
      <CardFooter>
        <Button 
          isSecondary
          onClick={onRefresh}
        >
          Refresh List
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingSubmissions;