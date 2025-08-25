type HeaderControlProps = {
    onAddProductClick: () => void;
};

export default function HeaderControl({ onAddProductClick }: HeaderControlProps) {
 return (
  <div>
          <div className='header-controls'>
              {/*Header area*/}
              <div className="search-box">
                  <input type='text' placeholder='Search...'/>
              </div>
              <div className="table-toolbar">
                  <button className="productButton" onClick={onAddProductClick}>
                      Add Product
                  </button>
              </div>
          </div>
  </div>
 );
};
