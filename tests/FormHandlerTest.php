<?php
use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

class FormHandlerTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();
        Monkey\setUp();
        $_FILES = array();
    }

    protected function tearDown(): void {
        Monkey\tearDown();
        parent::tearDown();
    }

    private function commonMocks($moderationEnabled) {
        $_POST = array(
            'nonce' => 'foo',
            'post_title' => 'My Title',
            'post_content' => 'My Content',
            'author_name' => 'Tester',
            'author_email' => 'test@example.com',
        );

        Functions\when('sanitize_text_field')->returnArg(1);
        Functions\when('sanitize_email')->returnArg(1);
        Functions\when('wp_unslash')->returnArg(1);
        Functions\when('wp_verify_nonce')->justReturn(true);
        Functions\when('wp_kses_post')->returnArg(1);
        Functions\when('__')->returnArg(1);
        Functions\when('is_email')->justReturn(true);
        Functions\when('get_option')->justReturn([
            'moderation_enabled' => $moderationEnabled,
            'spam_protection' => false,
            'submission_limit' => 0,
        ]);
        Functions\when('is_wp_error')->justReturn(false);
        Functions\when('update_post_meta')->justReturn(null);
        Functions\when('wp_send_json_success')->justReturn(null);
    }

    public function test_post_published_when_moderation_disabled() {
        $this->commonMocks(false);
        $captured = null;
        Functions\when('wp_insert_post')->alias(function($data) use (&$captured) {
            $captured = $data;
            return 1;
        });

        $handler = new IGPR_Form_Handler();
        $handler->handle_form_submission();

        $this->assertSame('publish', $captured['post_status']);
    }

    public function test_post_pending_when_moderation_enabled() {
        $this->commonMocks(true);
        $captured = null;
        Functions\when('wp_insert_post')->alias(function($data) use (&$captured) {
            $captured = $data;
            return 1;
        });

        $handler = new IGPR_Form_Handler();
        $handler->handle_form_submission();

        $this->assertSame('pending', $captured['post_status']);
    }
}
