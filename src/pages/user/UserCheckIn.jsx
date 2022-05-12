import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import UserSidebar from "../../components/UserSideBar";
import StopWatch from "../../components/StopWatch";
import UserTeamList from "./UserTeamList";

import mascot from "../../assets/img/mascot.svg";
import studyData from "../../assets/img/studydata.svg";

import { loadCheckList } from "../../redux/modules/checkIn";

const UserCheckIn = () => {
  const dispatch = useDispatch();

  // checkInList 조회를 위한 useEffect
  React.useEffect(() => {
    dispatch(loadCheckList("1주차"));
  }, []);

  const teamList = useSelector((state) => state.checkIn.checkInList);

  const logList = useSelector((state) => state.checkIn.checkIn);

  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        <BackgroundDiv>
          <UserSidebar teamList={teamList}/>
            <UpDataBox>
              <UpDataLeftBox>
                <img src={mascot} style={{height : 'auto' ,margin : '30px 39px', float : 'left'}}></img>
                <StudyData>
                  <div style={{height : '70%'}}>
                    <p style={{fontSize : '14px', fontWeight : '400'}}>
                      홍길동님 지금까지 <span style={{color : '#FF5F00', fontWeight : '600'}}>{logList?.totalSumTime}</span> 시간 <br />학습하셨어요!
                    </p>
                  </div>
                  <div style={{marginLeft : '55%'}}>
                    <img src={studyData}></img>
                  </div>
                </StudyData>
              </UpDataLeftBox>
              
              <UpDataRightBox>
                <StopWatch logList={logList}>
                </StopWatch>  
              </UpDataRightBox>

            </UpDataBox>

                <CheckInList>
                  {
                    teamList.map((e, idx)=>{
                      return(
                        <UserTeamList key={idx} e={e}></UserTeamList>
                      )
                    })
                  }
                </CheckInList>
        </BackgroundDiv>
      </div>
    </React.Fragment>
  );
};

const BackgroundDiv = styled.div`
  height : 100vh;
  min-width : 1440px;
  float : left;
  background-color : #F4F6F9;
  flex-grow : 1;
`

const UpDataBox = styled.div`
  height: 23%;
  margin-top: 4%;
  display: flex;
  // background-color : gray;
`;

const UpDataLeftBox = styled.div`
  width: 50%;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
`;

const UpDataRightBox = styled.div`
  width: 50%;
  height: 100%;
  float: left;
  // display : flex;
  // align-items: center;
`;

const StudyData = styled.div`
  height: 140px;
  width: 400px;
  float: left;
  box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  background-color: white;
  border-radius: 40px;
  padding: 20px;
`;

const CheckInList = styled.div`
  width : auto;
  height : 450px;
  margin-top : 40px;
  text-align: center;
  overflow: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    height: 10%;
    background: gray;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transition;
  }
  @media screen and (min-width: 1920px) {
    margin-top : 80px;
    height : 450px;
  }
  @media screen and (min-width: 2560px) {
    height: 750px;
  }
`;

export default UserCheckIn;
