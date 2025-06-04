<?php
use PHPUnit\Framework\TestCase;
use Brain\Monkey;
use Brain\Monkey\Functions;

class RateLimitTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();
        Monkey\setUp();
        Functions\when('sanitize_text_field')->returnArg(1);
        Functions\when('wp_unslash')->returnArg(1);
    }

    protected function tearDown(): void {
        Monkey\tearDown();
        parent::tearDown();
    }

    private function invokePrivate($object, string $method) {
        $ref = new ReflectionMethod($object, $method);
        $ref->setAccessible(true);
        return $ref;
    }

    public function test_limit_not_exceeded() {
        $_SERVER['REMOTE_ADDR'] = '1.2.3.4';
        Functions\when('get_option')->justReturn(['submission_limit' => 3]);
        Functions\when('get_transient')->justReturn(2);

        $handler = new IGPR_Form_Handler();
        $method = $this->invokePrivate($handler, 'is_submission_limit_exceeded');
        $result = $method->invoke($handler);

        $this->assertFalse($result);
    }

    public function test_limit_exceeded() {
        $_SERVER['REMOTE_ADDR'] = '1.2.3.4';
        Functions\when('get_option')->justReturn(['submission_limit' => 3]);
        Functions\when('get_transient')->justReturn(3);

        $handler = new IGPR_Form_Handler();
        $method = $this->invokePrivate($handler, 'is_submission_limit_exceeded');
        $this->assertTrue($method->invoke($handler));
    }

    public function test_record_submission_sets_transient() {
        $_SERVER['REMOTE_ADDR'] = '1.2.3.4';
        Functions\when('get_option')->justReturn(['submission_limit' => 3]);
        Functions\when('get_transient')->justReturn(false);

        $captured = [];
        Functions\when('set_transient')->alias(function($key, $value, $expiration) use (&$captured) {
            $captured = [$key, $value, $expiration];
        });

        $handler = new IGPR_Form_Handler();
        $method = $this->invokePrivate($handler, 'record_submission');
        $method->invoke($handler);

        $expectedKey = 'igpr_submissions_' . md5('1.2.3.4');
        $this->assertSame($expectedKey, $captured[0]);
        $this->assertSame(1, $captured[1]);
        $this->assertSame(DAY_IN_SECONDS, $captured[2]);
    }
}
