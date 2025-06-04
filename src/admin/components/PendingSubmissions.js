/**
 * Pending Submissions Component
 */
import { __ } from "@wordpress/i18n";
import { Button as ForceButton, Table, Container } from "@bsf/force-ui";

const PendingSubmissions = ({
  posts,
  count,
  onRefresh,
  onApprove,
  onReject,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">
          {__("Pending Submissions", "instant-guest-post-request")} ({count})
        </h2>
      </div>
      <div className="p-4">
        {posts.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Author</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {posts.map((post, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell>
                      <div>{post.author_name}</div>
                      <div>{post.author_email}</div>
                    </Table.Cell>
                    <Table.Cell>{post.date}</Table.Cell>
                    <Table.Cell>
                      <Container align="center" className="gap-2">
                        <ForceButton
                          variant="secondary"
                          size="sm"
                          href={post.preview_url}
                          target="_blank"
                          tag="a"
                        >
                          {__("Preview", "instant-guest-post-request")}
                        </ForceButton>
                        <ForceButton
                          variant="primary"
                          size="sm"
                          onClick={() => onApprove(post.id)}
                        >
                          {__("Approve", "instant-guest-post-request")}
                        </ForceButton>
                        <ForceButton
                          variant="danger"
                          size="sm"
                          onClick={() => onReject(post.id)}
                        >
                          {__("Reject", "instant-guest-post-request")}
                        </ForceButton>
                      </Container>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {__("No pending submissions", "instant-guest-post-request")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {__(
                "There are no pending guest post submissions at this time.",
                "instant-guest-post-request"
              )}
            </p>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-4 flex justify-end">
        <ForceButton variant="outline" size="sm" onClick={onRefresh}>
          {__("Refresh List", "instant-guest-post-request")}
        </ForceButton>
      </div>
    </div>
  );
};

export default PendingSubmissions;
