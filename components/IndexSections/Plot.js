import React, {Component} from 'react';
import { Document, Page, View, Text, pdfjs } from "react-pdf";
import { Pagination } from 'semantic-ui-react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

class Plot extends Component{
  constructor(){
    super();
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

}
  state = {
    numPages: null,
    pageNumber: 1,
  }
  onDocumentLoad = ({ numPages }) => {
   this.setState({ numPages });
 }
 handlePaginationChange = (e, { activePage }) => this.setState({ pageNumber:activePage })

render(){
  const { pageNumber, numPages } = this.state;

  return (
    <div className="container mx-auto mt-8 text-white">
      <div className="flex justify-around">
        <div className="px-4 sm:px-20 py-8 rounded-2xl text-center md:w-2/3">
          <span className="uppercase sm:text-xl tracking-widest">Plot</span>
          <h1 className="text-center mt-4">Context and Details</h1>
          <a href="../Traveler Loot - The Story.pdf">Download PDF</a>
          <div className="pdfContainer">
           <Document
             file="../Traveler Loot - The Story.pdf"
             onLoadSuccess={this.onDocumentLoad}
             externalLinkTarget = {"_blank"}
             renderMode = {"svg"}
           >
             <Page
                pageNumber={pageNumber}
             />
           </Document>
         </div>
         <Pagination
            style={{marginTop:'15px'}}
            defaultActivePage={pageNumber}
            boundaryRange={0}
            ellipsisItem={null}
            firstItem={1}
            lastItem={numPages}
            siblingRange={1}
            onPageChange={this.handlePaginationChange}
            totalPages={numPages}
          />

        </div>
      </div>
    </div>

  )
};
};
export default Plot;
