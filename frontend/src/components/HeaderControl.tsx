type HeaderControlProps = {
    onAddProductClick: () => void;
};

export default function HeaderControl({onAddProductClick}: HeaderControlProps) {
    return (
        <div className='header-container'>
            <div className='app-title'>
                <h1>Warehouse Management</h1>
            </div>
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
