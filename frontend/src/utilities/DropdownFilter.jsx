import "./../assets/css/components/dropdownfilter.css";
import Dropdown from 'react-bootstrap/Dropdown';

function DropdownFilter({ options, choosenOptions, setChoosen, title }) {

    //It sets the new choosen value for any kind of array
    function handleValue(e, id) {
        e.stopPropagation();

        const isSelected = choosenOptions.includes(id);

        if (isSelected) {
            setChoosen(choosenOptions.filter(ch => ch !== id));
        } else {
            setChoosen([...choosenOptions, id]);
        }
    }

    return (
        <Dropdown className="dropdown-filter me-3" onClick={(e) => e.stopPropagation()} drop="down" align="start">
            <Dropdown.Toggle>
                <div className='d-flex filter button'>
                    {title}
                    <div className="icon vector ms-1"></div>
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
                {options.map((option) => {
                    const checked = choosenOptions.includes(option.id);

                    return (
                        <Dropdown.Item
                            onClick={(e) => e.stopPropagation()}
                            key={option.id + title}
                            className="d-flex align-items-center justify-content-between w-100 px-2"
                        >
                            <div
                                onClick={(e) => handleValue(e, option.id)}
                                className={checked ? "checked" : "unchecked"}
                            >
                                {option.name}
                                <div className="icon"></div>
                            </div>
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default DropdownFilter;