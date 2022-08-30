import { forwardRef, Select } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SelectField = forwardRef((props, ref) => (
    <Select ref={ref} {...props}>
        {props.options.map((option, i) => {
            return <option key={`${props.name}-${i}`} value={option.value}>{option.label}</option>
        })}
    </Select>
));

SelectField.propTypes = {
    name: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.shape({
         label: PropTypes.string,
         value: PropTypes.string,
    })),
};

export default SelectField;