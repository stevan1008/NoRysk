<html>
    <head>
        <link href="{{ asset(mix('css/app.css')) }}" rel="stylesheet">
        <script src="{{ asset(mix('js/app.js')) }}"></script>

        <title>Recuperar tu contraseña</title>
    </head>

    <body>
        <form action="{{ route('password.change', ['email' => $email, 'code' => $code]) }}" method="post">
            @method('PUT')
            @csrf

            <br/>><br/>

            <div class="row" style="width: 99.8%">
                <div class="col-sm-12 text-center">
                    <img width="300" src="{{ asset('images/logo_synriesgo.svg') }}"/>
                    <h1>Reestablecer contraseña</h1>
                </div>
            </div>

            <div class="row" style="width: 99.8%">
                <div class="col-sm-12 text-center">
                    <label class="h5">Usuario: {{$email}}</label>
                </div>
            </div>

            @if(intval($status) == 0)
                <br/>

                <div class="row" style="width: 99.8%">
                    <div class="col-sm-4"></div>

                    <div class="col-sm-4">
                        <div class="alert alert-danger text-center" role="alert">
                            ¡Las contraseñas no coinciden!
                        </div>
                    </div>

                    <div class="col-sm-4"></div>
                </div>
            @endif

            @if(intval($status) == 2)
                <br/>

                <div class="row" style="width: 99.8%">
                    <div class="col-sm-4"></div>

                    <div class="col-sm-4">
                        <div class="alert alert-danger text-center" role="alert">
                            ¡La contraseña no cumple con los requisitos mínimos!
                        </div>
                    </div>

                    <div class="col-sm-4"></div>
                </div>
            @endif

            <br/>

            <div class="row" style="width: 99.8%">
                <div class="col-sm-4"></div>

                <div class="col-sm-4">
                    <label class="h6">Nueva contraseña</label>
                    <br/>
                    <input class="form-control" name="pass" type="password" placeholder="Nueva contraseña" max="20" required/>

                    <br/>

                    <label class="h6">Confirme la contraseña</label>
                    <br/>
                    <input class="form-control" name="pass_conf" type="password" placeholder="Confirme la contraseña" max="20" required/>

                    <br/><br/>

                    <div class="row">
                        <div class="col-sm-12 text-center">
                            <input class="btn btn-success" type="submit" value="Cambiar contraseña"/>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4"></div>
            </div>
        </form>
    </body>
</html>
