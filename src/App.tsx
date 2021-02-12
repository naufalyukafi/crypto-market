import React, {useState} from 'react';
import { Typography, Layout, Row, Col, Spin, Button } from "antd"
import { useQuery } from "react-query"

interface Price {
  id: string,
  name: string,
  current_price: number,
  market_cap: number,
  total_volume: number,
  price_change_percentage_24h:  number,
  image: string
}
interface IPercentage {
  percent: number
}
const getMarket = async(page: number) => {
  const URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=IDR&order=market_cap_desc&per_page=10&page=${page}`
  const response = await fetch(URL)
  if(!response.ok){
    throw new Error("Fetching Error");
  }
  return await response.json()
}
const Percentage = ({percent}: IPercentage) => {
  const formatPercent = Intl.NumberFormat("id-Id", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent / 100)
  let color = "black"
  if(percent > 0) {
    color = "green"
  } else if(percent < 0) {
    color = "red"
  }
  return (
    <div style={{color}}>{formatPercent}</div>
  )
}
const formatNumber = (num: number) => {
  return Intl.NumberFormat("id-Id").format(num)
}
function App() {
  const [page, setPage] = useState(1)
  const {data, isError, isSuccess, isFetching} = useQuery(["market", page], () => getMarket(page), {
    staleTime: 3000
  });

  const nextPage = () => {
    setPage(old => old + 1)
  }
  const prevPage = () => {
    setPage(old => old - 1)
  }

  return (
    <Layout style={{padding: "20px 3%", height: "100vh", backgroundColor: "#fff"}}>
      <Row justify="space-between" align="middle">
        <Col><Typography.Title level={2}>Crypto Market</Typography.Title></Col>
        <Col>
          {isFetching && (
            <Spin />
          )}
        </Col>
      </Row>
      {isError && <Typography.Title level={4} style={{color: "red"}}>*There was an error processing your request</Typography.Title>}
      <table style={{borderCollapse: "collapse", width: "100%", marginTop: 20}}>
        <tbody>
          <tr>
            <th style={{color: "grey", padding: 8}}>COINT</th>
            <th style={{color: "grey", padding: 8}}>LAST PRICE</th>
            <th style={{color: "grey", padding: 8}}>24 % CHANGE</th>
            <th style={{color: "grey", padding: 8}}>TOTAL VOLUME</th>
            <th style={{color: "grey", padding: 8}}>MARKET CAP</th>
          </tr>
        </tbody>
        <tbody>
        {isSuccess &&
          data?.map((price: Price) => {
            return (
              <tr key={price.id}>
                <td style={{color: "grey", padding: 8}}>
                  <Row align="middle">
                    <Col>
                      <img height={20} src={price.image} alt="img"/>
                    </Col>
                    <Col style={{paddingLeft: 5}}>{price.name}</Col>
                  </Row>
                </td>
                <td style={{color: "grey", padding: 8}}><Typography.Text>{formatNumber(price.current_price)}</Typography.Text></td>
                <td style={{color: "grey", padding: 8}}><Percentage percent={price.price_change_percentage_24h} /></td>
                <td style={{color: "grey", padding: 8}}><Typography.Text>{formatNumber(price.total_volume)}</Typography.Text></td>
                <td style={{color: "grey", padding: 8}}><Typography.Text>{formatNumber(price.market_cap)}</Typography.Text></td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
      <Row justify="start" style={{marginTop: 20}}>
        <Col style={{paddingRight: 20}}>
          <Button 
            type="primary"
            onClick={prevPage}
            disabled={page === 1 ? true : false}
          >Previous</Button></Col>
        <Typography.Title level={3} > {page} </Typography.Title>
        <Col style={{paddingLeft: 20}}>
        <Button 
          type="primary"
          onClick={nextPage}
        >Next</Button></Col>
      </Row>
    </Layout>
  );
}

export default App;
