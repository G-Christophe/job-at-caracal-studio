// ? This file contains an example of the structure needed to extend a component styles if you intend on using the feature
// ? Bear in mind this is not mandatory for the exercice but a nice bonus if we see that you understand this logic nicely
// ? Read more: https://chakra-ui.com/docs/theming/component-style

const Button = {
	// The styles all button have in common
	baseStyle: {
		borderRadius: 8,
	},

	// The sizes, for example `sm` and `md`
	sizes: {
		sm: {
			fontSize: 'sm',
			px: 4, // <-- px is short for paddingLeft and paddingRight
			py: 3, // <-- py is short for paddingTop and paddingBottom
		  },
		  md: {
			fontSize: 'md',
			px: 6, // <-- these values are tokens from the design system
			py: 5, // <-- these values are tokens from the design system
		  },
	},

	// The variants, for example `outline` and `solid`
	variants: {
		primary: {
			border: '1px solid',
			borderColor: '#232ADC',
			backgroundColor: '#232ADC',
			textColor: 'white',
			_hover: {
				bgColor: 'rgba(35, 42, 220, 0.8)',
				textColor: 'white'
			},
			_loading: {
				bgColor: '#232ADC'
			},
			
		},
		secondary: {
			border: '1px solid',
			borderColor: 'gray.300',
			borderColor: 'gray.300',
			_disabled: {
				borderColor: 'gray.100',
				bgColor: 'gray.100'
			}
		},
		ternary: {
			backgroundColor: '#EDEEFC',
		}
	},

	// The default props when you don’t specify any on the Component
	defaultProps: {
		variant: 'primary'
	},
};

export default Button;
