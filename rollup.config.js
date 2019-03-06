import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-minify-es';

export default {
    input: 'js/main.js',
    output: { 
    file: 'js/main_rollup.js',
    format: 'iife',
    name: 'beer_bank_main'
    },
    watch: {
        useChokidar: false
    },    
    plugins: [
        resolve(),
        commonjs(),
        minify()
    ]
}