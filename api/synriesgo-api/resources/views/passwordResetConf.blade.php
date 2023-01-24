<html>
    <head>
        <link href="{{ asset(mix('css/app.css')) }}" rel="stylesheet">
        <script src="{{ asset(mix('js/app.js')) }}"></script>

        <title>Contraseña actualizada</title>
    </head>

    <body>
        <br/><br/>

        <div class="row" style="width: 99.8%">
            <div class="col-sm-12 text-center">
                <img width="300" src="{{ asset('images/logo_synriesgo.svg') }}"/>
                <br/><br/>
                <h1>¡La contraseña fue cambiada exitosamente!</h1>
            </div>
        </div>

        <br/><br/>

        <div class="row" style="width: 99.8%">
            <div class="col-sm-12 text-center">
                <a class="link-success h4" href="{{env('CLI_URL')}}">Ir al inicio de sesión</a>
            </div>
        </div>
    </body>
</html>