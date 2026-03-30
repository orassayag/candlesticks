import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './Select.less';

const propTypes = {
    currentInterval: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    intervalsOptions: PropTypes.arrayOf(PropTypes.number)
};

const defaultProps = {};

const Select = (props) => {
    const { intervalsOptions, onChange, currentInterval } = props;

    return (
        <Fragment>
            {intervalsOptions.length > 0 &&
                <div className="styled-select black rounded">
                    <select onChange={onChange} value={currentInterval}>
                        {intervalsOptions.map((number, i) =>
                            <option key={i} value={number}>{number} seconds</option>)}
                    </select>
                </div>
            }
        </Fragment>
    );
};

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;