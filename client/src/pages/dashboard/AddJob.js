import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import FormRowSelect from '../../components/FormRowSelect'
const AddJob = () => {
    const {
        isEditing,
        isLoading,
        showAlert,
        displayAlert,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        handleChange,
        clearValues,
        createJob,
        editJob
    } = useAppContext()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!position || !company || !jobLocation) {
            displayAlert()
            return
        }
        if (isEditing) { // editing the job
            editJob()
            return
        }
        // creating job
        createJob()

    }

    const handleJobInput = (e) => {
        const name = e.target.name
        const value = e.target.value
        handleChange({ name, value })
    }

    return (
        <Wrapper>
            <form className='form'>
                <h3>{isEditing ? 'edit job' : 'add job'} </h3>
                {showAlert && <Alert />}

                {/* position */}
                <div className='form-center'>
                    <FormRow
                        type='text'
                        name='position'
                        value={position}
                        handleChange={handleJobInput}
                    />
                    {/* company */}
                    <FormRow
                        type='text'
                        name='company'
                        value={company}
                        handleChange={handleJobInput}
                    />
                    {/* location */}
                    <FormRow
                        type='text'
                        labelText='location'
                        name='jobLocation'
                        value={jobLocation}
                        handleChange={handleJobInput}
                    />
                    {/* job type */}
                    <FormRowSelect
                        labelText='job type'
                        value={jobType}
                        name='jobType'
                        handleChange={handleJobInput}
                        list={jobTypeOptions}
                    />
                    {/* job status */}
                    <FormRowSelect
                        labelText='job status'
                        value={status}
                        name='status'
                        handleChange={handleJobInput}
                        list={statusOptions}
                    />

                    <div className='btn-container'>
                        <button
                            className='btn btn-block submit-btn'
                            type='submit'
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            submit
                        </button>
                        <button
                            className='btn btn-block clear-btn'
                            onClick={(e) => {
                                e.preventDefault()
                                clearValues()
                            }}
                        >
                            clear
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    )
}

export default AddJob
