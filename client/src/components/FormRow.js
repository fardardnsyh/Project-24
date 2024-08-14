import React from 'react'

const FormRow = ({ type, value, name, handleChange, labelText }) => {
    return (
        <div className='form-row'>
            <label htmlFor={name} className='form-label'>
                {labelText || name}
            </label>

            <input
                type={type}
                value={value}
                name={name}
                onChange={handleChange}
                className='form-input'
            />
        </div>
    )
}

export default FormRow
