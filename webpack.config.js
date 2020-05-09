const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optmizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const HtmlwebPlugin = require('html-webpack-plugin');

let plugins = [];

plugins.push(new HtmlwebPlugin({

    hash: true,
    minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true
    },
    filename: 'index.html',
    template: __dirname + '/main.html'
}));

plugins.push(new extractTextPlugin('styles.css'));

plugins.push(new webpack.ProvidePlugin({
    '$': 'jquery/dist/jquery.js',
    'jQuery': 'jquery/dist/jquery.js'
}));

plugins.push(new webpack.optimize.CommonsChunkPlugin({

    name: 'vendor',
    filename: 'vendor.bundle.js'
}));

let SERVICE_URL = JSON.stringify('http://localhost:3000');

if(process.env.NODE_ENV == 'production') {

    SERVICE_URL = JSON.stringify('http://endereco-da-sua-api');
    
    // as alterações serão feitas no módulo, fazendo com que seu processamento ocorra mais rapidamente. 'diminuir a quantidade de closures'
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

    plugins.push(new babiliPlugin());

    plugins.push(new optmizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        },
        canPrint: true
    }));
}

// O DefinePlugin()recebe como parâmetro o objeto JS e os valores que varreremos os nosso módulos e trocar. Sempre que for encontrado SERVICE_URL no módulos deverá ser trocado pelo valor SERVICE_URL. Vimos anteriormente que no ES, quando o nome da propriedade tem o mesmo nome da variável, podemos deixar apenas uma referência. 
plugins.push(new webpack.DefinePlugin({SERVICE_URL}));

module.exports = {
    entry: {
        app: './app-src/app.js',
        vendor: ['jquery', 'bootstrap', 'reflect-metadata']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            }            
        ]
    },
    plugins
}