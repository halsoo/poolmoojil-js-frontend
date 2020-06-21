import React from 'react';

export default function InputWithLabel(props) {
    return props.name === 'phone' || props.name === 'birth' ? (
        <div className="w-full mb-4 flex flex-col justify-between">
            {props.error ? <div className="text-red-500 mb-2"> {props.error} </div> : null}
            <div className="w-full flex flex-row justify-between">
                <label className="lg:text-xl sm:text-4xl h-8 text-green-500">
                    {props.label} {props.required ? '*' : null}
                </label>
                <div
                    className={`w-50% flex flex-row ${
                        props.name === 'phone' ? 'justify-between' : 'justify-start'
                    }`}
                >
                    <input
                        className={`w-25% pl-2 border border-green-500 sm:rounded-none ${
                            props.name === 'birth' ? 'mr-8' : null
                        }`}
                        type={props.type}
                        name={props.name + 'A'}
                        value={props.valueA}
                        onChange={props.onChange}
                        placeholder={props.name === 'birth' ? 'YYYY' : props.placeholder}
                        disabled={props.disabled}
                    />
                    {props.name === 'phone' ? <p className="self-center"> - </p> : null}
                    <input
                        className={`w-${
                            props.name === 'phone' ? '25%' : '20%'
                        } pl-2 border border-green-500 sm:rounded-none
                        ${props.name === 'birth' ? 'mr-8' : null}`}
                        type={props.type}
                        name={props.name + 'B'}
                        value={props.valueB}
                        onChange={props.onChange}
                        placeholder={props.name === 'birth' ? 'MM' : props.placeholder}
                        disabled={props.disabled}
                    />
                    {props.name === 'phone' ? <p className="self-center"> - </p> : null}
                    <input
                        className={`w-${
                            props.name === 'phone' ? '25%' : '20%'
                        } pl-2 border border-green-500 sm:rounded-none`}
                        type={props.type}
                        name={props.name + 'C'}
                        value={props.valueC}
                        onChange={props.onChange}
                        placeholder={props.name === 'birth' ? 'DD' : props.placeholder}
                        disabled={props.disabled}
                    />
                </div>
            </div>
        </div>
    ) : (
        <div className="w-full mb-4 flex flex-col justify-between">
            {props.error ? <div className="text-red-500 mb-2"> {props.error} </div> : null}
            {props.okay ? (
                <div className="text-green-500 mb-2"> 사용 가능한 {props.label}입니다. </div>
            ) : null}
            <div className="w-full flex flex-row justify-between">
                <label className="lg:text-xl sm:text-4xl h-8 text-green-500">
                    {props.label} {props.required ? '*' : null}
                </label>
                <div className="w-50% flex flex-row justify-between">
                    <input
                        className={`w-${props.additionalButton ? '85%' : 'full'} ${
                            props.additionalButton ? 'mr-2' : null
                        } ${
                            props.disabled ? 'bg-purple-500' : null
                        } pl-2 border border-green-500 sm:rounded-none`}
                        type={props.type}
                        name={props.name}
                        onChange={props.onChange}
                        value={props.value || ''}
                        placeholder={props.placeholder}
                        disabled={props.disabled}
                    />
                    {props.additionalButton ? (
                        <button
                            className="w-25% h-full lg:text-lg sm:text-2xl bg-green-500 text-white"
                            type="button"
                            onClick={props.additionalOnClick}
                        >
                            {props.additionalLabel}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
