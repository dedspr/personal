$(function () {

    $.localDB = {
        init: function (func, param) {
            this.initDatabase(func, param);
        },

        initDatabase: function (func, param) {
            try {
                if (!window.openDatabase) {
                    alert('Local Databases are not supported by your browser');
                } else {
                    var shortName = 'DB',
                        version = '1.0',
                        displayName = 'DB App',
                        maxSize = 100000;

                    DB = openDatabase(shortName, version, displayName, maxSize);
                    this.createTables();
                }
            } catch (e) {
                if (e === 2) {
                    // Version mismatch.
                    console.log("Invalid database version.");
                } else {
                    console.log("Unknown error " + e + ".");
                }
                return;
            }
        },

		/***
		**** CREATE TABLE ** 
		***/
        createTables: function () {
            var that = this;
            DB.transaction(
                function (transaction) {
                    transaction.executeSql('CREATE TABLE IF NOT EXISTS usuario (idatleta, email, nome, stbloqueio, mensagem);', [], that.nullDataHandler, that.errorHandler);
                }
            );

        },

		/***
		**** INSERT INTO TABLE ** 
		***/

        salvarUsuario: function (idatleta, email, nome, stbloqueio, mensagem) {
            DB.transaction(
                function (transaction) {

                    transaction.executeSql("INSERT INTO usuario (idatleta, email, nome, stbloqueio, mensagem) VALUES (?, ?, ?, ?, ?)",
                        [idatleta, email, nome, stbloqueio, mensagem]);

                    window.location.href = "index.html";
                }
            );
        },

        verificaUsuario: function () {
            var that = this;

            DB.transaction(
                function (transaction) {
                    transaction.executeSql("SELECT * FROM usuario;", [], that.dataVerificaUsuario, that.errorHandler);
                }
            );
        },

        dataVerificaUsuario: function (transaction, results) {
            if (results.rows.length == 0)
                window.location.href = "login.html";
        },

        errorHandler: function (transaction, error) {

            if (error.code === 1) {
                // DB Table already exists
            } else {
                // Error is a human-readable string.
                console.log('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')');
            }
            return false;
        },

        nullDataHandler: function () {
            //console.log("SQL Query Succeeded");
        },

    };

});

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}