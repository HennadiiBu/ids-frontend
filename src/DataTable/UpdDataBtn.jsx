

const UpdDataBtn = ({ newData, updateReduxData }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        width: '100%',
        backgroundColor: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 0',
      }}
    >
      <button
        onClick={() => updateReduxData(newData)}
        style={{
          height: '30px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          borderRadius: '5px',
        }}
      >
        Оновити базу даних
      </button>
    </div>
  );
};

export default UpdDataBtn;
