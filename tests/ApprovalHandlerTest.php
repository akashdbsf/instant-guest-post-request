<?php
use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;
use function Patchwork\replace;
use function Patchwork\restoreAll;

class ApprovalHandlerTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void {
        restoreAll();
        Monkey\tearDown();
        parent::tearDown();
    }

    public function test_generate_email_action_links() {
        Functions\when('add_query_arg')->alias(function($args, $url) {
            return $url . '?' . http_build_query($args);
        });
        Functions\when('site_url')->justReturn('http://example.com');

        replace(IGPR_Approval_Handler::class.'::generate_action_token', function($id) {
            return 'abc123';
        });

        $handler = new IGPR_Approval_Handler();
        $links = $handler->generate_email_action_links(10);

        $this->assertSame('http://example.com?igpr_email_action=approve&post_id=10&token=abc123', $links['approve']);
        $this->assertSame('http://example.com?igpr_email_action=reject&post_id=10&token=abc123', $links['reject']);
    }
}
