import React from 'react';
import PropTypes from 'prop-types';
import './Button.less';

const propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

const defaultProps = {};

const Button = (props) => {

    return (
        <a href={null} className="latestCandlesticks" onClick={props.onClick}>{props.text}</a>
    );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;