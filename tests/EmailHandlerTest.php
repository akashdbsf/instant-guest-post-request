<?php
use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

class EmailHandlerTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();
        Monkey\setUp();
        Functions\when('__')->returnArg(1);
    }

    protected function tearDown(): void {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function test_send_status_notification_approved() {
        $post = (object) [ 'post_title' => 'My Post' ];
        Functions\when('get_post')->justReturn($post);
        Functions\when('get_post_meta')->alias(function($id, $key) {
            if ($key === '_igpr_author_name') {
                return 'Tester';
            }
            if ($key === '_igpr_author_email') {
                return 'test@example.com';
            }
            return '';
        });
        Functions\when('get_permalink')->justReturn('http://example.com/post');
        Functions\when('get_bloginfo')->justReturn('My Site');

        $captured = [];
        Functions\when('wp_mail')->alias(function($to, $subject, $body) use (&$captured) {
            $captured = [$to, $subject, $body];
            return true;
        });

        $handler = new IGPR_Email_Handler();
        $result = $handler->send_status_notification(1, 'approved');

        $this->assertTrue($result);
        $this->assertSame('test@example.com', $captured[0]);
        $this->assertStringContainsString('approved', strtolower($captured[1]));
    }
}
