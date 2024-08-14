import { useAppContext } from '../context/appContext'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageButtonContainer = () => {
    const { numOfPages, page, changePage } = useAppContext()
    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1
    })
    const prevPage = () => {
        const newPage = page - 1 < 1 ? numOfPages : page - 1
        changePage(newPage)
    }
    const nextPage = () => {

        const newPage = page + 1 > numOfPages ? 1 : page + 1
        changePage(newPage)
    }

    return (
        <Wrapper>
            <button className='prev-btn' onClick={prevPage}>
                <HiChevronDoubleLeft />
                prev
            </button>

            <div className='btn-container'>
                {pages.map((pageNumber) => {
                    return (
                        <button
                            type='button'
                            className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
                            key={pageNumber}
                            onClick={() => changePage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    )
                })}
            </div>

            <button className='next-btn' onClick={nextPage}>
                next
                <HiChevronDoubleRight />
            </button>
        </Wrapper>
    )
}

export default PageButtonContainer
