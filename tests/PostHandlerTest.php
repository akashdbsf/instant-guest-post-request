<?php
use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

class PostHandlerTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void {
        Monkey\tearDown();
        parent::tearDown();
    }

    public function test_generate_action_links() {
        Functions\when('get_post_meta')->justReturn('');
        Functions\when('wp_generate_password')->justReturn('tok');
        Functions\when('wp_hash_password')->justReturn('hashed');
        Functions\when('update_post_meta')->justReturn(null);
        Functions\when('admin_url')->justReturn('http://example.com/wp-admin/admin.php');
        Functions\when('add_query_arg')->alias(function($args, $url) {
            return $url . '?' . http_build_query($args);
        });
        Functions\when('get_preview_post_link')->alias(function($id){ return 'preview-' . $id; });
        Functions\when('get_edit_post_link')->alias(function($id){ return 'edit-' . $id; });

        $handler = new IGPR_Post_Handler();
        $links = $handler->generate_action_links(10);

        $this->assertSame('http://example.com/wp-admin/admin.php?igpr_action=approve&post_id=10&token=tok', $links['approve']);
        $this->assertSame('http://example.com/wp-admin/admin.php?igpr_action=reject&post_id=10&token=tok', $links['reject']);
        $this->assertSame('preview-10', $links['preview']);
        $this->assertSame('edit-10', $links['admin']);
    }
}
