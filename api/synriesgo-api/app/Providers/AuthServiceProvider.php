<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Route;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        if (!$this->app->routesAreCached()) {
            Route::prefix('api')->group(function () {
                Passport::routes();
            });
        }

        Passport::tokensCan([
            'password-reset' => 'Ask for password reset',
            'api' => 'Use API routes',
            'api_app' => 'Use API routes from the mobile app'
        ]);

        Passport::setDefaultScope([
            'api'
        ]);
    }
}
