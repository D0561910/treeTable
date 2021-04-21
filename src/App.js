import { useEffect, useState } from "react";
import TableTree from "react-table-tree";
import "./App.css";

function App() {
  const [expenseDatas, setExpenseDatas] = useState([]);
  const [oweValue, setoweValue] = useState("");
  const [paybackCashValue, setpaybackCashValue] = useState("");

  const columns = [
    {
      title: "日期",
      name: "date",
      width: "400px",
    },
    {
      title: "編號",
      name: "ids",
    },
    {
      title: "物品名稱",
      name: "item",
    },
    {
      title: "價格",
      name: "price",
    },
    {
      title: "付款人",
      name: "pay",
    },
    {
      title: "類型",
      name: "category",
    },
    {
      title: "时间戳记",
      name: "timestamp",
    },
  ];

  const data = {
    list: [
      {
        id: "root",
      },
      {
        id: "912020",
        parentId: "root",
        pay: "",
        date: "9-Jan-2020",
        item: "",
        category: "",
        ids: "",
        price: "",
        timestamp: "",
      },
      {
        id: 192,
        parentId: "912020",
        pay: "Chris",
        date: "9-Jan-2020",
        item: "beverage",
        category: "Drink",
        ids: "1578499200_229",
        price: 14,
        timestamp: 1578605214,
      },
      {
        id: 191,
        parentId: "912020",
        pay: "Charles",
        date: "9-Jan-2020",
        item: "beverage",
        category: "Drink",
        ids: "1578499200_564",
        price: 14,
        timestamp: 1578605214,
      },
      {
        id: 1012020,
        parentId: "root",
        pay: "",
        date: "10-Jan-2020",
        item: "",
        category: "",
        ids: "",
        price: "",
        timestamp: "",
      },
      {
        id: 200,
        parentId: 1012020,
        pay: "Charles",
        category: "Food",
        item: "dinner",
        ids: "1578585600_27",
        date: "10-Jan-2020",
        price: "-425.00",
        timestamp: 1582719468,
      },
      {
        id: 201,
        parentId: 1012020,
        category: "Food",
        price: "-99.00",
        date: "10-Jan-2020",
        ids: "1578585600_840",
        timestamp: 1578658748,
        item: "breakfast",
        pay: "Chris",
      },
      {
        id: 202,
        parentId: 1012020,
        pay: "Charles",
        price: "-99.00",
        item: "breakfast",
        timestamp: 1578658748,
        ids: "1578585600_889",
        category: "Food",
        date: "10-Jan-2020",
      },
    ],
    root: "root",
  };

  const refactorData = (jsonData) => {
    let treeRoot = [];
    let result = [];
    jsonData.forEach((item) => {
      if (!treeRoot.includes(item.date)) treeRoot.push(item.date);
      item.ids = item.id;
      item.id = `${item.date}_${Math.floor(Math.random() * 10000)}`;
      item.parentId = `${item.date}`;
      result.push(item);
    });

    // category = Loaded_income & item = pay_back
    const paybackValue = result.filter(
      (item) => item.item === "pay_back" || item.category === "Loaded_income"
    );

    const payBackCash = paybackValue.reduce(
      (accumulator, currentValue) => accumulator + parseInt(currentValue.price),
      0
    );

    setpaybackCashValue(payBackCash);

    const oweItem = result.filter(
      (item) => item.item !== "pay_back" || item.category !== "Loaded_income"
    );

    const oweCash = oweItem.reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(Math.abs(currentValue.price)),
      0
    );

    setoweValue(oweCash);

    result.filter(
      (item) => item.item === "pay_back" || item.category === "Loaded_income"
    );

    treeRoot.forEach((date) => {
      result.push({
        id: `${date}`,
        parentId: "root",
        date: `${date}`,
      });
    });

    result.push({ id: "root" });
    result.reverse();

    setExpenseDatas(result);
  };

  useEffect(() => {
    const getOnlineData = () => {
      fetch(
        "https://account2020withapi.herokuapp.com/api/expenseData/getAllExpenseData",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => data.returnData)
        .then((json) =>
          json.filter(
            (item) =>
              item.pay === "Chris" ||
              item.type === "Owe" ||
              item.category === "Loaded_income"
          )
        )
        .then((myJson) => refactorData(myJson))
        .catch((error) => console.error(error));
    };
    getOnlineData();
  }, []);

  const { root: rootId } = data;

  return (
    <div className="App">
      <div className="text_content">
        <div className="payback">Total Pay Back: {paybackCashValue} </div>
        <div className="ownamount">Total Owe Amout: {oweValue}</div>
        <div className="balance">
          Total Balance: {oweValue - paybackCashValue}
        </div>
      </div>
      <h3 className="header">All Record</h3>
      <TableTree
        datasets={expenseDatas}
        columns={columns}
        rootId={rootId}
        // total={{ visible: true, name: "合计数据" }}
        header={{ fixed: true, top: 0 }}
      />
    </div>
  );
}

export default App;
