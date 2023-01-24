<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordReset extends Mailable
{
    use Queueable, SerializesModels;

    public $route;
    public $emailVerifyKey;
    public $codeLife;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($route, $key, $life)
    {
        $this->route = $route;
        $this->emailVerifyKey = $key;
        $this->codeLife = $life;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('sender@example.com')
                    ->view('mail.passwordReset')
                    ->text('mail.passwordReset_plain')
                    ->with(
                        [
                            'route' => $this->route,
                            'key' => $this->emailVerifyKey,
                            'codeLife' => $this->codeLife
                        ]
                    );
    }
}
