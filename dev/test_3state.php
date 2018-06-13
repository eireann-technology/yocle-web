<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>Three state radio button</title>
		<style>
			body {
				background: #1d1d1d;
				font-family: 'Lato', sans-serif;
				font-size: 2rem;
				color: white;
				font-variant: small-caps;
			}

			/* height */
			/* width */
			/* toggle dimensions */
			/* font size */
			/* toggle's border thickness */
			/* toggle box shadow */
			/* labels animation time */
			/* label text color */
			/* colors: si, ?, no*/
			.wrapper {
				width: 12rem;
				height: 4rem;
				position: relative;
				margin: 2rem auto;
				border-radius: 2rem;
				background: gray;
			}
			.wrapper .toggle {
				width: 4.8rem;
				height: 4.8rem;
				position: absolute;
				left: 3.6rem;
				top: -0.4rem;
				border-radius: 50%;
				box-sizing: border-box;
				border: 0.1rem solid #ff6c00;
				background: #ff8933;
				box-shadow: 0 0 0.2rem 0.1rem #ff6c00 inset, 0 0 0.2rem 0.1rem #ff6c00;
				transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			}
			.wrapper label {
				cursor: pointer;
				width: 4rem;
				height: 4rem;
				position: absolute;
				margin: 0;
				padding: 0;
				z-index: 1;
				display: inline-block;
				text-align: center;
				line-height: 4rem;
				text-transform: uppercase;
				font-family: 'Lato', sans-serif;
				font-size: 2rem;
				font-weight: bold;
				color: white;
				-webkit-animation: 6s rot-label ease-in-out infinite;
				-moz-animation: 6s rot-label ease-in-out infinite;
				-o-animation: 6s rot-label ease-in-out infinite;
				animation: 6s rot-label ease-in-out infinite;
			}
			.wrapper input {
				position: absolute;
				left: 0;
				margin: 0;
				padding: 0;
				opacity: 0;
			}

			#yes_radio:checked {
				background: red;
			}
			#yes_radio:checked ~ .toggle {
				border: 0.1rem solid #008000;
				background: #00b300;
				box-shadow: 0 0 0.2rem 0.1rem #008000 inset, 0 0 0.2rem 0.1rem #008000;
				left: -0.4rem;
			}

			#no_radio:checked {
				background: red;
			}
			#no_radio:checked ~ .toggle {
				border: 0.1rem solid #ff0000;
				background: #ff3333;
				box-shadow: 0 0 0.2rem 0.1rem #ff0000 inset, 0 0 0.2rem 0.1rem #ff0000;
				left: 7.6rem;
			}

			#maybe_radio, #maybe-lbl {
				left: 33.33333%;
			}

			#no_radio, #no-lbl {
				left: 66.66667%;
			}

			#maybe-lbl {
				-webkit-animation-delay: 2s;
				-o-animation-delay: 2s;
				-moz-animation-delay: 2s;
				animation-delay: 2s;
			}

			#no-lbl {
				-webkit-animation-delay: 4s;
				-o-animation-delay: 4s;
				-moz-animation-delay: 4s;
				animation-delay: 4s;
			}
/*
			@-moz-keyframes rot-label {
				0% {
					transform: rotate(0deg);
				}
				15% {
					transform: rotate(-400deg);
				}
				18% {
					transform: rotate(-340deg);
				}
				20% {
					transform: rotate(-360deg);
				}
				30% {
					transform: rotate(-360deg);
				}
				100% {
					transform: rotate(-360deg);
				}
			}
			@-webkit-keyframes rot-label {
				0% {
					transform: rotate(0deg);
				}
				15% {
					transform: rotate(-400deg);
				}
				18% {
					transform: rotate(-340deg);
				}
				20% {
					transform: rotate(-360deg);
				}
				30% {
					transform: rotate(-360deg);
				}
				100% {
					transform: rotate(-360deg);
				}
			}
			@keyframes rot-label {
				0% {
					transform: rotate(0deg);
				}
				15% {
					transform: rotate(-400deg);
				}
				18% {
					transform: rotate(-340deg);
				}
				20% {
					transform: rotate(-360deg);
				}
				30% {
					transform: rotate(-360deg);
				}
				100% {
					transform: rotate(-360deg);
				}
			}
*/		
		</style>
  </head>
  <body>
	
  <div align="center">Three State Radio Button</div>
		<div class="wrapper">
		
			<label for="yes_radio" id="yes-lbl">si</label>
			<input type="radio" value="" name="choice_radio" id="yes_radio">
			
			<label for="maybe_radio" id="maybe-lbl">?</label>
			<input type="radio" value="" name="choice_radio" id="maybe_radio" checked="checked">
			
			<label for="no_radio" id="no-lbl">no</label>
			<input type="radio" value="" name="choice_radio" id="no_radio">
			
		<div class="toggle"></div>
	</div>

  </body>
</html>
