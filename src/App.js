// import logo from './logo.svg'
import './App.css'
import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'


function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function generateShuffledCombinations(words, maxCount=20) {
  const combinations = []
  for (let i = 0; i < maxCount; i++) {
    const shuffledWords = shuffleArray(words).join(' ')
    if (!combinations.includes(shuffledWords)) {
      combinations.push(shuffledWords)
    }
    if (combinations.length >= maxCount) break
  }
  return combinations
}

function App() {
  const [pass, setPass] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [str1, setStr1] = useState('')
  const [str2, setStr2] = useState('')
  const [result, setResult] = useState([])

  const correctPass = '1%topseller'
  const AUTH_DURATION = 12 * 60 * 60 * 1000

  useEffect(() => {
    const authTime = localStorage.getItem('authTime');
    if (authTime && (new Date().getTime() - parseInt(authTime)) < AUTH_DURATION) {
      setIsAuthenticated(true)
    } else {
      localStorage.clear()
    }
  }, [ AUTH_DURATION ])

  const handlePassChange = (event) => {
    setPass(event.target.value)
  }
  const handleLogin = () => {
    if (pass === correctPass) {
      setIsAuthenticated(true)
      setErrorMessage('')
      localStorage.setItem('authTime', new Date().getTime().toString())
    } else {
      setErrorMessage('Access Deny')
    }
  }

  const handleStr1Change = (event) => {
    setStr1(event.target.value)
  }
  const handleStr2Change = (event) => {
    setStr2(event.target.value)
  }
  const handleGenerateResults = () => {
    if (str2.trim()) {
      const words = str2.trim().split(/\s+/)
      const shuffledCombinations = generateShuffledCombinations(words)
      const combinedResults = shuffledCombinations.map((shuffled) => str1 + ' ' +shuffled)
      setResult(combinedResults)
    }
  }
  const handleClearInputs = () => {
    setStr1('')
    setStr2('')
    setResult([])
  }

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      result.map((res, index) => ({ 번호: index + 1, 결과: res, 길이: res.length }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '상품명 리스트')
    XLSX.writeFile(workbook, str1 + ' - 상품명.xlsx')
  }
  // const downloadCSV = () => {
  //   const csvContent = result.map((res, index) => `${index + 1},${res},${res.length}`).join('\n')
  //   const blob = new Blob([`번호,결과,길이\n${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  //   const link = document.createElement('a')
  //   const url = URL.createObjectURL(blob)
  //   link.setAttribute('href', url)
  //   link.setAttribute('download', '상품명.csv')
  //   link.click()
  // }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="input-group">
          <input
            type="password"
            value={pass}
            onChange={handlePassChange}
          />
        </div>
        <div className="button-group">
          <button onClick={handleLogin}>Pass</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>상품명 생성기</h1>
      <div>
        <label>메인 키워드 (15자 미만 또는 이하)</label>
        <br />
      </div>
      <div className="input-group">
        <input type="text" value={str1} onChange={handleStr1Change} />
        <span className="length-indicator">길이: {str1.length}</span>
      </div>
      <div>
          <label>서브 키워드 (35자 이하 또는 미만)</label>
      </div>
      <div className="input-group">
        <input type="text" value={str2} onChange={handleStr2Change} />
        <span className="length-indicator">길이: {str2.length}</span>
      </div>
      <div className="button-group">
        <button onClick={handleGenerateResults}>결과 생성</button>
        <button onClick={handleClearInputs}>입력 초기화</button>
      </div>

      {
        result.length > 0 &&
        <>
          <div className="output">
            <h2>상품명 (50자 이하)</h2>
            <ul>
              {result.map((res, index) => (
                <li key={index}>
                {index + 1}. {res} <span className="result-length">(길이: {res.length})</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="button-group">
            <button onClick={downloadExcel}>Download Excel</button>
            {/* <button onClick={downloadCSV}>Download CSV</button> */}
          </div>
        </>
      }

    </div>
  )
}

export default App