import React from "react";
import styled from "styled-components";
import Form from "./Form";
export function Modal({state, changeState}) {
  const closeModal = () => {
    changeState(false);
  };
  return (
    <>
      {state && (
        <Overlay>
          <ModalContainer>
            <ModalHead>
              <h3>Nueva publicidad</h3>
            </ModalHead>
            <CloseButton onClick={closeModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </CloseButton>
            <Form CloseMod={closeModal}></Form>
          </ModalContainer>
        </Overlay>
      )}
    </>
  );
}

export default Modal;

//Componentes pequeños con styled components

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position:absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  padding: 40px;
  justify-content: center;
`;

const ModalContainer = styled.div`
  width: 500px;
  height: 800px;
  z-index: 3;
  background: #ffff;
  overflow: scroll;
  position: relative;
  border-radius: 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 20px;
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  paddingf-botton: 20px;
  border-bottom: 1px solid #a3a2a2;

  h3 {
    font-weight: 700;
    font-size: 16px;
    color: #1766dc;
  }
`;

const CloseButton = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;

    width: 30px;
    height: 30px;
    border:none;
    background: none;
    cursor: pointer;
    transition: .3s ease all;
    border-radius: 5px;
    color: #1766DC
    
    &:hover {
        background: #f2f2f2;
    }

    svg {
        width: 100%;
        height: 100%;
    }
`;