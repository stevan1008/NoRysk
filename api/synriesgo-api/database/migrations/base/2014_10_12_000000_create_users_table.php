<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('email_verif_code')->nullable();
            $table->timestamp('email_verif_code_life')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->integer('cli_fk_id')->nullable();
            $table->integer('rol_fk_id')->nullable();
            $table->integer('tdo_fk_id')->nullable();
            $table->string('usu_documento', 100)->nullable();
            $table->boolean('usu_activo')->default(true);

            $table->timestamps();

            $table->foreign('cli_fk_id')->references('cli_pk_id')->on('clientes');
            $table->foreign('rol_fk_id')->references('rol_pk_id')->on('roles');
            $table->foreign('tdo_fk_id')->references('tdo_pk_id')->on('tipos_documento');

            $table->index(['email', 'usu_activo']);
            $table->index('email_verif_code');
            $table->index('cli_fk_id');
            $table->index('rol_fk_id');
            $table->index('tdo_fk_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
