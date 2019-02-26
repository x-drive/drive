var babel = require('@babel/core')

const DEF_OPT = {
	cwd: __dirname,
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				targets: {
					browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
				},
			},
		],
	],
}

module.exports = function(content, file, options) {
	var opt = fis.get('babel.config') || DEF_OPT
	var result = babel.transformSync(content, opt)
	return result.code
}
