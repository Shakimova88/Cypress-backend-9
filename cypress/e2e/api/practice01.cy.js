describe('TechGlobal Student APIs', () => {
  const baseUrl = 'https://api.tech-global-training.com'
  let createdStudentId
  const uniqueEmail = `test.student.${Date.now()}@example.com`
  const studentDetails = {
    DOB: '2000-01-01',
    EMAIL: uniqueEmail,
    FIRST_NAME: 'Test',
    LAST_NAME: 'Student',
    INSTRUCTOR_ID: 1,
  }

  // Task 1: Get All Students
  it('Retrieve all students and validate the response', () => {
    cy.request(`${baseUrl}/students`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.length).to.be.gte(2)
      response.body.forEach((student) => {
        expect(student).to.have.property('STUDENT_ID')
      })
    })
  })

  // Task 2: Create a New Student
  it('Create a new student and validate the response', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/students`,
      body: studentDetails,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(201)
      createdStudentId = response.body.STUDENT_ID
      expect(response.body.STUDENT_ID).to.be.gt(2)
      expect(response.body.DOB).to.eq(studentDetails.DOB)
      expect(response.body.EMAIL).to.eq(studentDetails.EMAIL)
      expect(response.body.FIRST_NAME).to.eq(studentDetails.FIRST_NAME)
      expect(response.body.LAST_NAME).to.eq(studentDetails.LAST_NAME)
      expect(response.body.INSTRUCTOR_ID).to.eq(studentDetails.INSTRUCTOR_ID)
    })
  })

  // Task 3: Get Newly Created Student
  it('Retrieve the newly created student and validate the response', () => {
    cy.request(`${baseUrl}/students/${createdStudentId}`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.STUDENT_ID).to.eq(createdStudentId)
      expect(response.body.DOB).to.eq(`${studentDetails.DOB}T00:00:00.000Z`)
      expect(response.body.EMAIL).to.eq(studentDetails.EMAIL)
      expect(response.body.FIRST_NAME).to.eq(studentDetails.FIRST_NAME)
      expect(response.body.LAST_NAME).to.eq(studentDetails.LAST_NAME)
      expect(response.body.INSTRUCTOR_ID).to.eq(studentDetails.INSTRUCTOR_ID)
    })
  })

  // Task 4: Update Newly Created Student with a Different Instructor
  it('Update the newly created student with a different instructor and validate the response', () => {
    const updatedInstructorId = 2
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/students/${createdStudentId}`,
      body: {
        ...studentDetails,
        INSTRUCTOR_ID: updatedInstructorId,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  // Task 5: Delete Newly Created Student
  it('Delete the newly created student and validate the response', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/students/${createdStudentId}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      cy.request({
        method: 'GET',
        url: `${baseUrl}/students/${createdStudentId}`,
        failOnStatusCode: false,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(404)
      })
    })
  })
})
