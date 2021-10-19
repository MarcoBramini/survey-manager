import { useState } from "react";
import { Pagination } from "react-bootstrap";

import "./Paginator.css";
function Paginator(props) {
  const pageCount = parseInt(props.pageCount);
  const [currentPage, setCurrentPage] = useState(parseInt(props.initialPage));

  const onPageClick = (pageIndex) => {
    if (currentPage === pageIndex) return;
    setCurrentPage(pageIndex);
    props.onPageChange(pageIndex);
  };

  const buildPageList = () => {
    const pageIndexesList = Array.from(
      { length: pageCount <= 5 ? pageCount : 5 },
      (v, i) => {
        if (pageCount <= 5 || currentPage < 3) {
          return i + 1;
        }
        if (currentPage > pageCount - 3) {
          return pageCount - 4 + i;
        }
        return i - 2 + currentPage;
      }
    );

    return (
      <>
        {pageIndexesList[0] !== 1 ? <Pagination.Ellipsis /> : null}
        {pageIndexesList.map((pageIndex) => (
          <Pagination.Item
            key={`page-${pageIndex}`}
            active={currentPage === pageIndex}
            onClick={() => onPageClick(pageIndex)}>
            {pageIndex}
          </Pagination.Item>
        ))}
        {pageIndexesList[pageIndexesList.length - 1] < pageCount ? (
          <Pagination.Ellipsis />
        ) : null}
      </>
    );
  };

  return <Pagination className='mb-0'>{buildPageList()}</Pagination>;
}

export default Paginator;
